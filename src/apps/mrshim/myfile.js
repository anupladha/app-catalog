define(["is!hasHighcharts?highcharts-shim:highcharts", "lumenize-0.7.3-shim","jquery", "is!hasUnderscore?underscore-shim:underscore"], function(hc,lz,jq, _) {
        return {
            canRemote : false,
            onProjectChanged : function(newProjectOid) {},
            onReleaseChanged : function(newReleaseOid) {},
            onResize : function() {
                console.debug("⚡ onResize");
            },



            prefs: function() {
                return [
                    {type: 'text', name: 'chart-title', label: 'Chart Title', default: 'Chart Title'},
                    {type: 'text', name: 'chart-subtitle', label: 'Chart Sub-Title', default: "Sub Title"},
                    {type: 'combobox', name: 'color', label: 'Color Fool', default: 'red', values:[
                        {label:'Red', value: 'red'},
                        {label:'Blue', value: 'blue'}
                    ]}
                ];
            },

            /**
             * build the chart up front.  we'll populate the series later, but we want to render 'something'
             * immediately.
             * @private
             */
            init: function() {
                var self = this;
                var elId = this.api().el().id;
                jq("#" + elId).html("Creating chart...");
                this.chart = new hc.Chart({
                    chart: {
                        renderTo: this.api().el().id,
                        type: 'bar'
                    },
                    xAxis: {
                        tickWidth: 0,
                        labels : {
                            enabled:false
                        }
                    },
                    yAxis: {
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.series.name +'</b><br/>'+ this.y;
                        }
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    }
                });
                window.c = this.chart;
            },

            query : function(success,error) {
                var self = this;
//                console.debug("MrShim::query");
//
//                var timeFrameUnit = this.api().getSetting("timeFrameUnit");
//                console.debug("timeFrameUnit", timeFrameUnit);
//
//                var timeFrameQuantity = this.api().getSetting("timeFrameQuantity");
//                console.debug("timeFrameQuantity", timeFrameQuantity);
                var query = {
                    find: {
                        _TypeHierarchy: "Defect",
                        State: {$lte: "Closed" },
                        _ProjectHierarchy: this.api().getProject(),
                        Release:  this.api().getRelease()
                    },
                    fields: ["_ValidFrom", "_ValidTo", "ObjectID", "ScheduleState"],
                    hydrate: ["ScheduleState"]
                }


                var data = JSON.stringify(query, undefined, 2);
                jq.ajax({
                    url:this.api().lbapiUrl(),
                    data: data,
                    error: error,
                    success: success,
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json"
                });
            },

            transform : function(data, done) {
                config =  {
                    granularity: "day",
                    validFromField: '_ValidFrom',
                    validToField: '_ValidTo',
                    uniqueIDField: 'ScheduleState',
                    tz : "America/Denver",
                    trackLastValueForTheseFields: ['_ValidTo', 'ScheduleState']
                }

                var tisc = new lz.TimeInStateCalculator(config)
                tisc.addSnapshots(data.Results, '2012-01-05T00:00:00.000Z', '2014-01-05T00:00:00.000Z')

                done(_.map(tisc.getResults(), function(v) {
                    return {name: v.ScheduleState,data:[v.ticks]};
                }));
            },

            visualize : function(data) {
                var self = this;
                this.chart.xAxis[0].setTitle({text:"Schedule State"});
                jq.each(data, function(i,x) {
                    self.chart.addSeries(x);
                });
                this._updateTitles();
            },

            _updateTitles: function() {
                this.chart.setTitle(
                    {text: this.api().getPreference('chart-title'),
                        style: { color: this.api().getPreference('color') }},
                    {text: this.api().getPreference('chart-subtitle')}
                );
                this.chart.yAxis[0].setTitle({text:'Yep'});
            }
        }
    }
);

