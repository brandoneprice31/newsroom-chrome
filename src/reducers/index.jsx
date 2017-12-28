import {combineReducers} from 'redux';
import userReducer from './user-reducer';
import pageReducer from './page-reducer';
import commentsReducer from './comments-reducer';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
    user: userReducer,
    page: pageReducer,
    comments: commentsReducer
});

export default allReducers
