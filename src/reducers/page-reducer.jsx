export default function (state = null, action) {
    switch (action.type) {
        case 'PAGE_CHANGED':
            return action.payload;
            break;
    }
    return state;
}
