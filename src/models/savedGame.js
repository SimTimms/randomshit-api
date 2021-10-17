import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { UserTC, FactionTC, GameTC } from './';
import { getUserId } from '../utils';

const ObjectId = mongoose.Types.ObjectId;

export const SavedGameSchema = new Schema(
  {
    url: { type: String },
    likes: [{ type: String }],
    unitName: { type: String },
    unitHistory: { type: String },
    unitRank: { type: String },
    saveDataColors: { type: String },
    saveDataParts: { type: String },
    faction: { type: Schema.Types.ObjectId, ref: 'Faction' },
    model: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
    },
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

SavedGameTC.addRelation('model', {
  resolver: () => GameTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: ObjectId(source.model) }),
  },
  projection: { _id: true },
});

SavedGameTC.addRelation('user', {
  resolver: () => UserTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: ObjectId(source.user) }),
  },
  projection: { _id: true },
});

SavedGameTC.addRelation('faction', {
  resolver: () => FactionTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: ObjectId(source.faction) }),
  },
  projection: { _id: true },
});

SavedGameTC.addResolver({
  name: 'myModels',
  type: [SavedGameTC],
  kind: 'query',
  resolve: async ({ source, args, context }) => {
    const userId = getUserId(context.headers.authorization);
    const myModels = await SavedGame.find({
      user: { $in: userId },
    }).sort({ createdAt: -1 });

    return myModels;
  },
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
