'use strict';

var React = require('react'),
    DOM = React.DOM, td = DOM.td, tr = DOM.tr, th = DOM.th, thead = DOM.thead, table = DOM.table;

var List = React.createClass({
    update: function () {

    },

    getInitialState: function() {
        console.log('hi mom!');

        return {data: [
            { time: ' 4:19  ',
                to: 'Newark Penn',
                track: '1',
                line: 'Raritan Valley',
                train: '5742',
                status: 'in 21 Min',
                minutesLeft: 21,
                class: 'ready-line' }

        ]};
    },
    render: function () {
        var items = this.state.data.map(function (item) {
            return tr( {className:item.class},
                    td(null, item.time),
                    td(null, item.to),
                    td(null, item.track),
                    td(null, item.line),
                    td(null, item.train),
                    td(null, item.status) )
        });

        return table({className:'table schedule'},
                thead(
                    td(null, 'Departs'),
                    th(null, 'To'),
                    th(null, 'Track'),
                    th(null, 'Line'),
                    th(null, 'Train'),
                    th(null, 'Status')
                ),
                items
            );
    }
});

module.exports = List;
