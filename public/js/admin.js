const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');


    // Here we can use the fetch method which is a method supported by the browser for sending http requests and it's not just for fetching data as the name might suggest, it's also for sending data.
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        // Well we can set headers and in the headers, we could encode

        // our csrf token because we still need to attach this to our request and right now we are not doing that.
        
        // We cannot send it in the request body because delete requests don't have a body
        
        // but the good thing is the csurf package which we are using on a server does not just look into request bodies,

        headers: {
            'csrf-token': csrf
        }
        })
        .then(result => {
            console.log(result)
            return result.json();
        })
        .then(data => {
            // data - message: "Success!"
            console.log(data);
            // here we are finding and remove article once backende removed here this code removes that article from the DOM
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err);
        });
};
