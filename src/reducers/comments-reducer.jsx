export default function (state = null, action) {
    switch (action.type) {
        case 'COMMENTS_CHANGED':
            return action.payload;
            break;
    }
    return state;
}
