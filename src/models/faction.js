import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { UserTC } from './';
import { getUserId } from '../utils';

const ObjectId = mongoose.Types.ObjectId;

export const FactionSchema = new Schema(
  {
    url: { type: String },
    likes: [{ type: String }],
    gameId: { type: String },
    factionName: { type: String },
    factionLocation: { type: String },
    factionHistory: { type: String },
    factionMotto: { type: String },
    unitName: { type: String },
    unitHistory: { type: String },
    unitRank: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    collection: 'factions',
  }
);

FactionSchema.plugin(timestamps);
FactionSchema.index({ createdAt: 1, updatedAt: 1 });

export const Faction = mongoose.model('Faction', FactionSchema);
export const FactionTC = composeWithMongoose(Faction);

FactionTC.addRelation('user', {
  resolver: () => UserTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: ObjectId(source.user) }),
  },
  projection: { _id: true },
});

FactionTC.addResolver({
  name: 'factionLike',
  args: { url: 'String' },
  type: 'Boolean',
  kind: 'mutation',
  resolve: async ({ source, args, context }) => {
    const userId = getUserId(context.headers.authorization);
    const exists = await Faction.findOne({
      likes: { $in: userId },
      url: args.url,
    });

    if (!exists) {
      await Faction.updateOne({ url: args.url }, { $push: { likes: userId } });
    }
    return exists ? true : false;
  },
});
