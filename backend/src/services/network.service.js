import { User } from '../models/user.model.js';

async function buildTree(userId, depth = 3) {
  if (depth === 0) return [];
  const nodeUsers = await User.find({ sponsor: userId }).lean();
  return Promise.all(
    nodeUsers.map(async (node) => ({
      ...node,
      children: await buildTree(node._id, depth - 1),
    }))
  );
}

export async function getDownlineTree(userId, depth = 3) {
  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found');

  const children = await buildTree(user._id, depth);
  return { ...user, children };
}

export async function getTeamStats(userId) {
  const directAffiliates = await User.countDocuments({ sponsor: userId });
  const totalAffiliates = await countDescendants(userId);
  return { directAffiliates, totalAffiliates };
}

async function countDescendants(userId) {
  const queue = [userId];
  let count = 0;

  while (queue.length) {
    const current = queue.shift();
    // eslint-disable-next-line no-await-in-loop
    const children = await User.find({ sponsor: current }).select('_id');
    count += children.length;
    queue.push(...children.map((child) => child._id));
  }

  return count;
}
