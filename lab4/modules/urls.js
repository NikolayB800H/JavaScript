import {accessToken, /*accessTokenApplication,*/ accessTokenApplicationPers, version} from "./consts.js";

class Urls {
    constructor() {
        this.url = 'https://api.vk.com/method'
        this.commonInfo = `access_token=${accessToken}&v=${version}`
        //this.commonInfoApplication = `access_token=${accessTokenApplication}&v=${version}`
        this.commonInfoApplicationPers = `access_token=${accessTokenApplicationPers}&v=${version}`
    }

    getUserInfo(userId) {
        return `${this.url}/users.get?user_ids=${userId}&fields=photo_400_orig&${this.commonInfo}`
    }

    getGroupMembers(groupId) {
        return `${this.url}/groups.getMembers?group_id=${groupId}&fields=photo_400_orig&${this.commonInfo}`
    }

    getConversationMembers(peer_id) {
        return `${this.url}/messages.getConversationMembers?peer_id=${peer_id}&${this.commonInfo}`
    }

    getConversations(groupId) {
        return `${this.url}/messages.getConversations?group_id=${groupId}&extended=1&${this.commonInfo}`
    }

    oAuth(client_id, redirect_uri) {
        return `https://oauth.vk.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=token&scope=wall&${this.commonInfo}`
    }

    getWall(groupId) {
        return `${this.url}/wall.get?owner_id=${-groupId}&filter=others&${this.commonInfoApplicationPers}`
    }

    addLike(groupId, id) {
        return `${this.url}/likes.add?type=post&owner_id=${-groupId}&item_id=${id}&${this.commonInfoApplicationPers}`
    }
}

export const urls = new Urls()