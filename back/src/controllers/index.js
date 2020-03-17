const User = require('../models/users');

const getRelations = (users, id) => {
    return users.map(el => {
        const relation =
            el.friends.find(value => value.toString() === id) ? 'friend'
                : el.outgoing.find(value => value.toString() === id) ? 'incoming'
                    : el.incoming.find(value => value.toString() === id) ? 'outgoing'
                        : null;

        return { id: el.id, login: el.login, relation, photo: el.photo};
    });
};

module.exports = {
    login: async function (req, res) {
        if (req.body.login && req.body.password) {
            const { login, password } = req.body;

            const users = await User.find({});

            const user = users.find(el => el.login === login);

            if (user) {
                if (user.password === password) {
                    console.log(`${user.login} success log in at ${new Date()}`);
                    res.send({ id: user.id });
                }
                else {
                    res.send({ status: 0 });
                }
            }
            else {
                res.send({ status: 0 });
            }
        }

        else {
            res.sendStatus(400);
        }
    },
    getAllUsers: async function (req, res) {
        const id = req.query.id;

        const users = await User.find({ _id: { $ne: id } });

        if (id) {
            const filteredUsers = getRelations(users, id);
            res.send(filteredUsers);
        }

        else {
            res.sendStatus(400);
        }
    },
    changeRelations: async function (req, res) {
        const sourceId = req.query.sourceId;
        const targetId = req.query.targetId;
        const addFriend = req.query.addFriend;

        if (sourceId && targetId) {
            const [sourceUser] = await User.find({ _id: sourceId });
            const [targetUser] = await User.find({ _id: targetId });

            if (sourceUser.friends.indexOf(targetId) >= 0) {

                const filteredSourceFriends = sourceUser.friends.filter(el => el.toString() !== targetId);
                const filteredTargetFriends = targetUser.friends.filter(el => el.toString() !== sourceId);

                User.updateOne(
                    { _id: sourceId },
                    { $set: { friends: filteredSourceFriends } },
                    () => console.log('Source updated')
                );

                User.updateOne(
                    { _id: targetId },
                    { $set: { friends: filteredTargetFriends } },
                    () => console.log('Target updated')
                );

                const filteredUsers = getRelations(await User.find({ _id: { $ne: sourceId } }), sourceId);
                res.send(filteredUsers);
            }

            else if (sourceUser.outgoing.indexOf(targetId) >= 0) {
                const filteredSourceOutgoing = sourceUser.outgoing.filter(el => el.toString() !== targetId);
                const filteredTargetIncoming = targetUser.incoming.filter(el => el.toString() !== sourceId);

                await User.updateOne(
                    { _id: sourceId },
                    { $set: { outgoing: filteredSourceOutgoing } },
                    () => console.log('Source updated')
                );

                await User.updateOne(
                    { _id: targetId },
                    { $set: { incoming: filteredTargetIncoming } },
                    () => console.log('Target updated')
                );

                const filteredUsers = getRelations(await User.find({ _id: { $ne: sourceId } }), sourceId);
                res.send(filteredUsers);
            }

            else if (sourceUser.incoming.indexOf(targetId) >= 0) {
                const filteredSourceIncoming = sourceUser.incoming.filter(el => el.toString() !== targetId);
                const filteredTargetOutgoing = targetUser.outgoing.filter(el => el.toString() !== sourceId);

                await User.updateOne(
                    { _id: sourceId },
                    { $set: { incoming: filteredSourceIncoming } },
                    () => console.log('Source updated')
                );

                await User.updateOne(
                    { _id: targetId },
                    { $set: { outgoing: filteredTargetOutgoing } },
                    () => console.log('Target updated')
                );

                if (addFriend) {
                    await User.updateOne(
                        { _id: sourceId },
                        { $set: { friends: [...sourceUser.friends, targetUser._id] } },
                        () => console.log('Source updated')
                    );

                    await User.updateOne(
                        { _id: targetId },
                        { $set: { friends: [...targetUser.friends, sourceUser._id] } },
                        () => console.log('Target updated')
                    );
                }

                const filteredUsers = getRelations(await User.find({ _id: { $ne: sourceId } }), sourceId);
                res.send(filteredUsers);
            }

            else {
                await User.updateOne(
                    { _id: sourceId },
                    { $set: { outgoing: [...sourceUser.outgoing, targetUser._id] } },
                    () => console.log('Source updated')
                );

                await User.updateOne(
                    { _id: targetId },
                    { $set: { incoming: [...targetUser.incoming, sourceUser._id] } },
                    () => console.log('Target updated')
                );

                const filteredUsers = getRelations(await User.find({ _id: { $ne: sourceId } }), sourceId);
                res.send(filteredUsers);
            }
        }
        else {
            res.sendStatus(400);
        }
    },
};
