import { FactionTC } from '../models';
import { getUserId } from '../utils';

const FactionQuery = {
  factionById: FactionTC.getResolver('findById'),
  factionByIds: FactionTC.getResolver('findByIds'),
  factionOne: FactionTC.getResolver('findOne'),
  factionMany: FactionTC.getResolver('findMany'),
  factionCount: FactionTC.getResolver('count'),
  factionConnection: FactionTC.getResolver('connection'),
  factionPagination: FactionTC.getResolver('pagination'),
};

const FactionMutation = {
  factionCreateOne: FactionTC.getResolver('createOne').wrapResolve(
    (next) => async (rp) => {
      const userId = getUserId(rp.context.headers.authorization);
      rp.args.record.user = userId;

      const faction = await next(rp);
      return faction;
    }
  ),
  factionCreateMany: FactionTC.getResolver('createMany'),
  factionUpdateById: FactionTC.getResolver('updateById'),
  factionUpdateOne: FactionTC.getResolver('updateOne'),
  factionUpdateMany: FactionTC.getResolver('updateMany'),
  factionRemoveById: FactionTC.getResolver('removeById'),
  factionRemoveOne: FactionTC.getResolver('removeOne'),
  factionRemoveMany: FactionTC.getResolver('removeMany'),
  factionLike: FactionTC.getResolver('factionLike'),
};

export { FactionQuery, FactionMutation };
