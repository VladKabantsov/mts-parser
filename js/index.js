var xhr = new XMLHttpRequest();

var data;

xhr.open('GET', 'http://213.108.129.190/xml/get-temp-data', false);

xhr.send();

try {

    if ( xhr.status !== 200 ) {
        throw (xhr.status + ': ' + xhr.statusText);
    } else {

        data = JSON.parse(xhr.responseText);
    }
} catch ( e ) {

    alert(e);
}

var result = {};

var level = -1;

var levelKeys = [];

var dataCopy = Object.assign({}, data);

parse(dataCopy);

console.log(result);

function parse(value, passKey) {

    level++;

    // remember keys on current levels tree
    if (level === 1) {
        // set as title if title is exist
        if (value[ 'Title' ]) {

            levelKeys[ 1 ] = value[ 'Title' ];
        } else {

            levelKeys[ 1 ] = passKey;
        }
    } else if (level === 2) {

        if (value[ 'Title' ]) {

            levelKeys[ 2 ] = value[ 'Title' ];
        } else {

            levelKeys[ 2 ] = passKey;
        }
    }

    // go through array
    if ( Array.isArray(value) || typeof(value) === 'object' ) {

        for ( var key in value ) {
            parse(value[ key ], key);
        }
    } else {

        // push variable on second level
        if ( level === 2 ) {

            // check variable on "undefined"
            if ( !result[ levelKeys[ 1 ] ] ) {

                result[ levelKeys[ 1 ] ] = {};
            }

            result[ levelKeys[ 1 ] ][ passKey ] = value;
        } if ( level === 3 ) { // push variable on third level

            if ( !result[ levelKeys[ 1 ] ] ) {

                result[ levelKeys[ 1 ] ] = {};
            }

            if ( !result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ] ) {

                result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ] = {};
            }

            result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ][ passKey ] = value;
        } else if ( level > 3 ) {

            // if value nested more than 3 times push it on third level with unique key
            if ( !result[ levelKeys[ 1 ] ] ) {

                result[ levelKeys[ 1 ] ] = {};
            }

            if ( !result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ] ) {

                result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ] = {};
            }

            result[ levelKeys[ 1 ] ][ levelKeys[ 2 ] ][ levelKeys[ 1 ] + '_' + levelKeys[ 2 ] + '_' + passKey + '_' + level ] = value;
        } else {

            // copy variable on first level
            result[ passKey ] = value;
        }
    }

    level--;
}