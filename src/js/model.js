/**
 * Model file for working with data
 */
import data from './data';
import helpers from './helpers';
import view from './view';

/**
 * Main Model Object
 *
 */
let model = {};

/**
 * Initializes the model
 *
 */
model.init = function() {
    data.init();
    model.discoverPaintings();
    data.firebaseInit();
    model.submitForm();
}

/**
 * renderData - returns the data from the fetch call
 *
 *  @return {Object} data
 */
model.render = function( theData ) {
    let collection = theData.records;
    let sizeString = '?height=600&width=600';

    if ( collection[0].images.length == 0 || collection[0].images === undefined ) {
        view.clearData();
        data.fetchData();
    } else {
        for ( let item of collection ) {
            let painting = item.images[0].baseimageurl + sizeString;
            let credit = item.creditline;
            let description = item.title;
            let imgSrc = item.url;
    
            view.displayImage( painting );
            view.addAltTag( credit );
            view.addImageSrc( imgSrc );
            view.displayDescription( description );
        } 
    }
};

/**
 * discoverPaintings - event listener to pull new painting
 */
model.discoverPaintings = function( ) {
    let discoverBtn = document.getElementById( 'discoverBtn' );
    discoverBtn.addEventListener( 'click', view.reloadImage );
};

/**
 * submitForm - event listener to process impressions
 */
model.submitForm = function( ) {
    let submitButton = document.querySelector( '#submit' );
    submitButton.addEventListener( 'click', model.processForm );
};

/**
 * processForm - push the data to the database
 */
model.processForm = function( e ) {
    e.preventDefault();
    
    let firestore = firebase.firestore();
    let docRef = firestore.doc( 'impressions/testDoc' );
    let commentEl = helpers.getCommentEl();
    let commentToSave = commentEl.value;

    docRef.set({
        comment: commentToSave
    }).catch(function(err){
        console.log( 'Error!' );
    });

    view.displayImpression( commentToSave, docRef );
};


export default model;