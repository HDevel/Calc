module.exports = {
    block: 'page',
    title: 'calculator',
    head: [
        { elem: 'css', url: 'calculator.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'calculator.min.js' }],
    content: [
       {
           block: 'calculator'
       }
    ]
};
