export const signInUser = (user) => {
    return {
        type: 'USER_SIGNED_IN',
        payload: user
    }
};

export const logOutUser = (user) => {
    return {
        type: 'USER_LOGGED_OUT'
    }
};

export const pageChange = (page) => {
    return {
        type: 'PAGE_CHANGED',
        payload: page
    }
};

export const commentsChange = (comments) => {
    return {
        type: 'COMMENTS_CHANGED',
        payload: comments
    }
};
