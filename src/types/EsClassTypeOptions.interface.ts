import { DynamicMapping } from '@opensearch-project/opensearch/api/_types/_common.mapping';
import { EsQuery } from '../query/query';

export type DynamicMappingTypes = DynamicMapping;

export interface EsClassTypeOptionsInterface {
  aliases?: string[];
  name?: string;
  mapping?: {
    dynamic?: DynamicMappingTypes;
  };
  options?: {
    refresh?: 'wait_for' | boolean;
  };
  settings?: {
    number_of_shards?: number;
    number_of_replicas?: number;
    [key: string]: unknown;
  };
}

export type EsIndexTypeFn<T = unknown> = (
  entity?: T,
  query?: EsQuery<T>,
) => string;
export type EsIndexType<T = unknown> = EsIndexTypeFn<T> | string;

export interface ESClassFullTypeOptionsInterface<T = unknown>
  extends EsClassTypeOptionsInterface {
  index: EsIndexType<T>;
}
