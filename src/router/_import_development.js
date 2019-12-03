
//export default file => require(file)

//module.exports = file => require('@/components/'+file).default
module.exports = file => () => import('@/components/'+file)