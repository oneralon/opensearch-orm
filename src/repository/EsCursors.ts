import { Search_Request } from '@opensearch-project/opensearch/api';
import { Readable } from 'node:stream';
import { EsQuery } from '../query/query';
import { EsSortTypes } from '../query/sort';
import { EsRepositoryInterface } from './EsRepository.interface';

export class EsFindCursor<T> extends Readable {
  private searchAfter: Array<unknown>;

  constructor(
    private readonly query: EsQuery<T> & { sort: EsSortTypes<T> },
    private readonly repository: EsRepositoryInterface<T>,
    private readonly populate?: (items: Array<T>) => Promise<Array<unknown>>,
    private readonly params: Partial<Search_Request> = {},
  ) {
    super({
      autoDestroy: true,
      objectMode: true,
      read: function (this: EsFindCursor<T>, size: number) {
        Promise.resolve(
          (async () => {
            try {
              const searchAfter = this.searchAfter
                ? { search_after: this.searchAfter }
                : {};

              const { entities, raw } = await this.repository.find(
                { ...this.query, ...searchAfter, size },
                this.params,
              );

              if (entities.length) {
                if (this.populate) {
                  const populated = await this.populate(entities);

                  populated.forEach((entity) => this.push(entity));
                } else {
                  entities.forEach((entity) => this.push(entity));
                }

                this.searchAfter = raw.body.hits.hits.at(-1).sort;
              } else {
                this.push(null);
              }
            } catch (e) {
              this.emit('error', e);
            }
          })(),
        );
      },
    });
  }
}
