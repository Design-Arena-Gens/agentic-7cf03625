import { getDownlineTree, getTeamStats } from '../services/network.service.js';

export async function getTree(req, res, next) {
  try {
    const tree = await getDownlineTree(req.user._id, Number(req.query.depth) || 3);
    return res.json({ tree });
  } catch (err) {
    return next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const stats = await getTeamStats(req.user._id);
    return res.json({ stats });
  } catch (err) {
    return next(err);
  }
}
