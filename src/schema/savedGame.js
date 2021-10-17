import { SavedGameTC } from '../models';
import { getUserId } from '../utils';

const SavedGameQuery = {
  savedGameById: SavedGameTC.getResolver('findById'),
  savedGameByIds: SavedGameTC.getResolver('findByIds'),
  savedGameOne: SavedGameTC.getResolver('findOne'),
  savedGameMany: SavedGameTC.getResolver('findMany'),
  savedGameCount: SavedGameTC.getResolver('count'),
  savedGameConnection: SavedGameTC.getResolver('connection'),
  savedGamePagination: SavedGameTC.getResolver('pagination'),
  myModels: SavedGameTC.getResolver('myModels'),
};

const SavedGameMutation = {
  savedGameCreateOne: SavedGameTC.getResolver('createOne').wrapResolve(
    (next) => async (rp) => {
      const userId = getUserId(rp.context.headers.authorization);
      rp.args.record.user = userId;

      const savedGame = await next(rp);
      return savedGame;
    }
  ),
  savedGameCreateMany: SavedGameTC.getResolver('createMany'),
  savedGameUpdateById: SavedGameTC.getResolver('updateById'),
  savedGameUpdateOne: SavedGameTC.getResolver('updateOne'),
  savedGameUpdateMany: SavedGameTC.getResolver('updateMany'),
  savedGameRemoveById: SavedGameTC.getResolver('removeById'),
  savedGameRemoveOne: SavedGameTC.getResolver('removeOne'),
  savedGameRemoveMany: SavedGameTC.getResolver('removeMany'),
  savedGameLike: SavedGameTC.getResolver('savedGameLike'),
};

export { SavedGameQuery, SavedGameMutation };
