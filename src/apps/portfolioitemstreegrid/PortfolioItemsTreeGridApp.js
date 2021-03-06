(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.portfolioitemstreegrid.PortfolioItemsTreeGridApp', {
        extend: 'Rally.apps.treegrid.TreeGridApp',
        requires: [
            'Rally.ui.grid.TreeGrid',
            'Rally.ui.grid.plugin.TreeGridExpandedRowPersistence',
            'Rally.ui.gridboard.GridBoard',
            'Rally.ui.picker.PillPicker',
            'Rally.ui.picker.MultiObjectPicker',
            'Rally.ui.gridboard.plugin.GridBoardFieldPicker',
            'Rally.ui.gridboard.plugin.GridBoardCustomFilterControl'
        ],
        alias: 'widget.portfolioitemstreegridapp',
        componentCls: 'pitreegrid',

        statePrefix: 'portfolioitems',

        config: {
            defaultSettings: {
                modelNames: ['PortfolioItem/Strategy'],
                columnNames: ['Name', 'PercentDoneByStoryPlanEstimate', 'PercentDoneByStoryCount', 'PreliminaryEstimate', 'PlannedStartDate', 'PlannedEndDate', 'ValueScore', 'RiskScore', 'InvestmentCategory']
            }
        },

        constructor: function (config) {
            this.callParent(arguments);

            this._configureFilter();
        },

        _configureFilter: function() {
            this.filterControlConfig = {
                blacklistFields: ['PortfolioItemType', 'State'],
                stateful: true,
                stateId: this.getContext().getScopedStateId('portfolio-tree-custom-filter-button'),
                whiteListFields: ['Milestones']
            };
        }
    });
})();
