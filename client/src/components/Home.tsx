import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import { useParams } from 'react-router-dom'
import Slider from 'rc-slider'
// import { clearError, getProducts } from '../actions/productActions'
import { MetaData } from './layout/MetaData'
import type {} from 'redux-thunk/extend-redux'
import { RootState } from '../store'
import { ProductComp } from './product/product'
import { Loader } from './layout/Loader'
import 'rc-slider/assets/index.css'
import axios from 'axios'
import { setProducts } from '../slices/productSlice'
import { clearStatus } from '../slices/appStateSlice'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider.Range)

export const Home = () => {
  const { keyword } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState([1, 1000])
  const {
    loading,
    products = [],
    productCount,
    itemsPerPage,
    error
  } = useSelector((state: RootState) => state.product)
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    const getProducts = async (
      page: number,
      keyword: string,
      price: number[],
      category: string
    ) => {
      let url = `http://localhost:4000/api/v1/products?page=${page}&keyword=${keyword}&minprice=${price[0]}&maxprice=${price[1]}`

      if (category) {
        url += `&category=${category}`
      }

      const { data } = await axios.get(url, { withCredentials: true })

      dispatch(setProducts(data))
    }
    getProducts(currentPage, keyword || '', price, category)
  }, [dispatch, currentPage, keyword, price, category])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }
  }, [error])

  const categories = [
    'Electronics',
    'Cameras',
    'Laptop',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ]

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title='Home'></MetaData>
      <h1 id='products_heading'>Latest Products</h1>
      <section id='products' className='container mt-5'>
        <div className='row'>
          {keyword ? (
            <>
              <div className='col-6 col-md-3 mt-5 mb-5'>
                <div className='px-5'>
                  <Range
                    marks={{ 1: `$1`, 1000: `$1000` }}
                    min={1}
                    max={1000}
                    defaultValue={[1, 1000]}
                    tipFormatter={value => `$${value}`}
                    tipProps={{ placement: 'top', visible: true }}
                    value={price}
                    onChange={price => setPrice(price)}
                  ></Range>

                  <hr className='my-5' />

                  <div className='mt-5'>
                    <h4 className='mb-3'>Categories</h4>

                    <ul className='pl-0'>
                      {categories.map(category => (
                        <li
                          key={category}
                          style={{ cursor: 'pointer', listStyleType: 'none' }}
                          onClick={() => setCategory(category)}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='col-6 col-md-9'>
                <div className='row'>
                  {products.map(product => (
                    <ProductComp key={product._id} product={product} col={3} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            products.map(product => <ProductComp key={product._id} product={product} col={4} />)
          )}
        </div>
      </section>

      {itemsPerPage < productCount && (
        <div className='d-flex justify-content-center mt-5'>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={productCount}
            onChange={handlePageChange}
            nextPageText='Next'
            prevPageText='Prev'
            firstPageText='First'
            lastPageText='Last'
            itemClass='page-item'
            linkClass='page-link'
          />
        </div>
      )}
    </>
  )
}
