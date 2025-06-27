import log from 'loglevel';
const logger = log.getLogger('default');

export async function addTransferPipeline({ authenticatedEthosFetch, params }) {
    const resource = 'x-xgrptdfn-transfer-pipeline';
    try {
        const start = new Date();

        // If you need to pass query params, use URLSearchParams here
        const urlSearchParameters = new URLSearchParams({
            guid: params.guid
            // add other query params if needed
        }).toString();

        const resourcePath = `${resource}?${urlSearchParameters}`;

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(params)
        });

        const end = new Date();
        logger.debug(`post ${resource} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();
                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error('unable to call transfer pipeline: ', error);
        throw error;
    }
}