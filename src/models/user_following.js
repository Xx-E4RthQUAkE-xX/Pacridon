const Record = require('./record');

class UserFollowing extends Record {
    static tableName() {
        return "user_ followings";
    }

    static columns() {
        return ["user_id", "target_id"];
    }

    static insertColumns() {
        return ["user_id", "target_id"];
    }

    static create(user) {
        return new this({ user_id: user.data.id }).save();
    }

    insert() {
        this.data.id = UUID();
        return super.insert();
    }
}

module.exports = UserFollowing;