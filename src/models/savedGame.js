import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { UserTC } from './';
import { getUserId } from '../utils';

const ObjectId = mongoose.Types.ObjectId;

export const SavedGameSchema = new Schema(
  {
    url: { type: String },
    likes: [{ type: String }],
    gameId: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    collection: 'savedSavedGames',
  }
);

SavedGameSchema.plugin(timestamps);
SavedGameSchema.index({ createdAt: 1, updatedAt: 1 });

export const SavedGame = mongoose.model('SavedGame', SavedGameSchema);
export const SavedGameTC = composeWithMongoose(SavedGame);

SavedGameTC.addRelation('user', {
  resolver: () => UserTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: ObjectId(source.user) }),
  },
  projection: { _id: true },
});

SavedGameTC.addResolver({
  name: 'savedGameLike',
  args: { url: 'String' },
  type: 'Boolean',
  kind: 'mutation',
  resolve: async ({ source, args, context }) => {
    const userId = getUserId(context.headers.authorization);
    const exists = await SavedGame.findOne({
      likes: { $in: userId },
      url: args.url,
    });

    if (!exists) {
      await SavedGame.updateOne(
        { url: args.url },
        { $push: { likes: userId } }
      );
    }
    return exists ? true : false;
  },
});
