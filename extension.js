module.exports = {
    name: 'InsightRptRuntime',
    publisher: 'Sample',
    "queries": {
        'getPersons': [{
            'resourceVersions': {
                'persons': {
                    min: 12
                }
            },
            'query': `query getPersons($personId: ID){
                            persons: {persons} (
                                filter: { id: {EQ: $personId}}
                            )
                            {
                                edges {
                                    node {
                                      id
                                      gender
                                      names{
                                          firstName
                                          lastName
                                          preference
                                      }
                                      credentials {
                                        type
                                        value
                                      }
                                      emails {
                                        type {
                                            emailType
                                        }
                                        preference
                                        address
                                      }
                                    }
                                  }
                                }
                              }`
        }]
    },
    cards: [{
        type: 'InsightRpRuntimeCard',
        source: './src/cards/InsightRptRuntimeCard',
        title: 'InsightRptRuntime Card',
        displayCardType: 'InsightRptRuntime Card',
        description: 'This is an introductory card to the Ellucian Experience SDK',
        configuration: {
            client: [{
                "key": "insights-url",
                "label": "Insights URL",
                "type": "url",
                "required": true

            }

            ],
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: true
            }],



        },
        pageRoute: {
            route: '/',
            excludeClickSelectors: ['a']
        }
    }],
};