//the url for the pdf
const url = '../docs/pdf.pdf';

//store the pdf doc
let pdfDoc = null,
    //the page number
    pageNum = 1,
    // if page is rendering
    pageIsRendering = false,
    pageNumIsPending  = null;

const scale = 1.5,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');


// function to render page
const renderPage = num => {
    pageIsRendering = true;

    //get the page
    pdfDoc.getPage(num).then( page =>{
        //set the scale of the page
        const viewport = page.getViewport({scale});        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext:ctx,
            viewport
        };

        //rendering
        page.render(renderCtx).promise.then(()=> {
            pageIsRendering = false;

            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        //output current page
        document.querySelector('#page-num').textContent = num;

    })
};

//check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num;
    }
    else{
        renderPage(num);
    }
};

//show prev page
const showPrevPage = () => {
    if(pageNum <= 1 ){
        return;
    }

    pageNum--;
    queueRenderPage(pageNum);
};

//show next page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages ){
        return;
    }

    pageNum++;
    queueRenderPage(pageNum);
};



//get the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    //set the global pdf doc to the returned pdf
    pdfDoc = pdfDoc_;

    //set the total number of pages
    document.querySelector('#page-count').textContent = pdfDoc.numPages;
    //call the function to render the page
    renderPage(pageNum);
})
.catch(err => {
    //display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div,canvas);
    //remove top-bar
    document.querySelector('#top-bar').style.display = 'none';
});


//button events
document.querySelector('#prev-page').addEventListener('click',showPrevPage);
document.querySelector('#next-page').addEventListener('click',showNextPage);






