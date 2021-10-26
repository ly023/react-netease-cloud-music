import {VIDEO_TYPE} from 'constants'

export function getVideoPathname(type, id) {
    switch (type) {
        case VIDEO_TYPE.MV.TYPE:
            return `/mv/${id}`
        default:
            return `/video/${id}`
    }
}
