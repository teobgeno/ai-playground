/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameObjectDef } from '../models/GameObjectDef';
import type { SectionDef } from '../models/SectionDef';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public rootGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }

    /**
     * Test
     * @returns any Successful Response
     * @throws ApiError
     */
    public testTestGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/test',
        });
    }

    /**
     * Getsections
     * @returns SectionDef Successful Response
     * @throws ApiError
     */
    public getSectionsGetGameSectionsGet(): CancelablePromise<Array<SectionDef>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/getGameSections',
        });
    }

    /**
     * Getgameobjects
     * @returns GameObjectDef Successful Response
     * @throws ApiError
     */
    public getGameObjectsGetGameObjectsGet(): CancelablePromise<Array<GameObjectDef>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/getGameObjects',
        });
    }

    /**
     * Getworldmap
     * @param x 
     * @param y 
     * @returns any Successful Response
     * @throws ApiError
     */
    public getWorldMapGetWorldMapXYGet(
x: number,
y: number,
): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/getWorldMap/{x}/{y}',
            path: {
                'x': x,
                'y': y,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
