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
                    td(item.time),
                    td(item.to),
                    td(item.track),
                    td(item.line),
                    td(item.train),
                    td(item.status) )
        });

        return table({className:'table schedule'},
                thead(
                    tr(
                        th('Departs'),
                        th('To'),
                        th('Track'),
                        th('Line'),
                        th('Train'),
                        th('Status')
                    )
                ),
                items
            );
    }
});

module.exports = List;
