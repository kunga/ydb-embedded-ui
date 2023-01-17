import {FETCH_TOPIC} from '../../store/reducers/topic';
import type {ApiRequestAction} from '../../store/utils';
import type {IResponseError} from '../api/error';
import type {DescribeTopicResult} from '../api/topic';

export interface ITopicState {
    loading: boolean;
    wasLoaded: boolean;
    data?: DescribeTopicResult;
    error?: IResponseError;
}

export type ITopicAction = ApiRequestAction<
    typeof FETCH_TOPIC,
    DescribeTopicResult,
    IResponseError
>;

export interface ITopicRootStateSlice {
    topic: ITopicState;
}