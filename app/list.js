'use strict';
var $ = require('jquery');
var _ = require('lodash');
var React = require('react'),
    DOM = React.DOM, td = DOM.td, tr = DOM.tr, th = DOM.th, thead = DOM.thead, table = DOM.table, tbody = React.DOM.tbody;

var processedTrains = [];

var minutesLeftWhenBellShouldBeRung = 2;
//how often to query for new data. (in milliseconds)
var frequencyDataRefresh = 30000;

var List = React.createClass({
    loadSchedulesFromServer: function () {
        $.ajax({
            url: "/getdata",
            dataType: 'json',
            success: function (data) {
                this.setState({data: data});
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    render: function () {

        var items = this.state.data.map(function (item) {
            return tr({key:"row" + item.train,className: item.class},
                    td({key: item.time}, item.time),
                    td({key: item.to}, item.to),
                    td({key: item.track}, item.track),
                    td({key: item.line}, item.line),
                    td({key: item.train}, item.train),
                    td({key: item.status}, item.status))
                    });

        return table(
            {className: 'table schedule'},
            thead({key:"head"},
                tr(null, th({key: "depart"}, 'Depart'),
                    th({key: "to"}, 'To'),
                    th({key: "track"}, 'Track'),
                    th({key: "line"},  'Line'),
                    th({key: "train"}, 'Train'),
                    th({key: "status"}, 'Status')
                )
            ),
            tbody({key:"items"}, items)
        );

    },
    componentDidMount: function () {

        this.loadSchedulesFromServer();
        setInterval(this.loadSchedulesFromServer, frequencyDataRefresh);

    },
    componentDidUpdate: function (prevProps, prevState) {

        var data = this.state.data;
        var currentTrainsIDs = [];

        var newTrainsArriving = false;

        //identify all trains for which we should ring bell
        data.forEach( function(trainItem) {

            if (trainItem.minutesLeft != null && trainItem.minutesLeft <= minutesLeftWhenBellShouldBeRung
                && trainItem.minutesLeft > 0
                && $.inArray(trainItem.train, processedTrains) == -1) {

                if (!newTrainsArriving) {
                    newTrainsArriving = true;
                }

                processedTrains.push(trainItem.train);
            }

            //store ids of the trains
            currentTrainsIDs.push(trainItem.train);
        });

        //lets check if need to play sound
        if (newTrainsArriving) {
            new Audio('/bell.mp3').play();
        }

        //console.log("Processed trains is " + processedTrains + " " + new Date());
        //lets remove any processed trains that are no longer on the board
        var trainsProcessedAndNotOnBoard = getTrainsProcessedAndNotOnBoard(processedTrains, currentTrainsIDs);
        //console.log("Trains to remove   " + trainsProcessedAndNotOnBoard);
        processedTrains = _.difference(processedTrains, trainsProcessedAndNotOnBoard);
        //console.log("Processed trains is " + processedTrains + " " + new Date());

    }
});

function getTrainsProcessedAndNotOnBoard(A, B) {
    return _.filter(A, function (a) {
        return !_.contains(B, a);
    });
}


module.exports = List;


