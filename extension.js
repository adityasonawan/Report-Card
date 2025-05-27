module.exports = {
    name: 'Reports Dropdown',
    publisher: 'Sample',
    cards: [{
        type: "SearchCard",
        source: "./src/cards/SearchCard.jsx",
        title: "Reports Dropdown",
        displayCardType: "SearchCard",
        description: "Dropdown to select reports.",
        pageRoute: {
            route: '/',
            excludeClickSelectors: ['a']
        }
    }],
    page: {
        source: './src/page/router.jsx',
    }
};