import releaseGoodsRouter from './release_goods'
import releaseSpecialRouter from './release_special'
import releaseMallRouter from './release_mall'

export default [
  ...releaseGoodsRouter,
  ...releaseSpecialRouter,
  ...releaseMallRouter,
]