import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { RootState } from '../../store'
import { Sidebar } from './Sidebar'
import { clearStatus, setSuccess } from '../../slices/appStateSlice'
import { setProductDetail, updateAdminProduct } from '../../slices/productSlice'
import { getProduct, updateProduct } from '../../services/productService'

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

export const UpdateProduct = () => {
  const { id } = useParams()

  const { loading, product, error } = useSelector((state: RootState) => state.product)
  const {
    loading: appLoading,
    message,
    error: appError
  } = useSelector((state: RootState) => state.appState)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('0')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('0')
  const [seller, setSeller] = useState('')
  const [images, setImages] = useState<FileList | null>(null)
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const dispatch = useDispatch()
  const alert = useAlert()
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      dispatch(setProductDetail(await getProduct(id as string)))
    }

    getData()
  }, [dispatch, id])

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(String(product.price))
      setDescription(product.description)
      setCategory(product.category)
      setStock(String(product.stock))
      setSeller(product.seller)

      setImagePreview(product.images.map(img => 'http://localhost:4000/' + img.url))
    }
  }, [product])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearStatus())
    }

    if (message) {
      navigate('/admin/products')
      alert.success(message)
      dispatch(clearStatus())
    }
  }, [error, message])

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      setImages(files)
      setImagePreview([])

      for (let file of files) {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagePreview(imgs => [...imgs, reader.result as string])
          }
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const product = new FormData()

    product.append('name', name)
    product.append('price', price)
    product.append('description', description)
    product.append('category', category)
    product.append('seller', seller)
    product.append('stock', stock)

    if (images) {
      for (const f of images) {
        product.append('images', f)
      }
    }

    dispatch(updateAdminProduct(await updateProduct(id as string, product)))
    dispatch(setSuccess('Product updated successfully'))
  }

  return (
    <div className='row'>
      <div className='col-12 col-md-2'>
        <Sidebar></Sidebar>
      </div>
      <div className='col-12 col-md-10'>
        <div className='wrapper my-5'>
          <form className='shadow-lg' onSubmit={handleSubmit}>
            <h1 className='mb-4'>Edit Product</h1>

            <div className='form-group'>
              <label htmlFor='name_field'>Name</label>
              <input
                type='text'
                className='form-control'
                id='name_field'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='price_field'>Price</label>
              <input
                type='text'
                className='form-control'
                id='price_field'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description_field'>Description</label>
              <textarea
                className='form-control'
                id='description_field'
                value={description}
                rows={8}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='category_field'>Category</label>
              <select
                className='form-control'
                id='category_field'
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value='' disabled>
                  Select category
                </option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='stock_field'>Stock</label>
              <input
                type='text'
                className='form-control'
                id='stock_field'
                value={stock}
                onChange={e => setStock(e.target.value)}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='seller_field'>Seller name</label>
              <input
                type='text'
                className='form-control'
                id='seller_field'
                value={seller}
                onChange={e => setSeller(e.target.value)}
              />
            </div>

            <div className='form-group '>
              <label>Images</label>

              <div className='custom-file'>
                <input
                  type='file'
                  multiple
                  className='custom-file-input'
                  id='customFile'
                  // value={images}
                  onChange={handleImagesChange}
                />
                <label className='custom-file-label' htmlFor='customFile'>
                  Choose images
                </label>
              </div>
              <p className='my-2'>
                {imagePreview.map(img => (
                  <img
                    src={img}
                    key={img}
                    alt='img preview'
                    width='55'
                    height='52'
                    className='mt-3 mr-2'
                  />
                ))}
              </p>
            </div>

            <button
              id='submit_button'
              type='submit'
              className='btn btn-block py-3'
              disabled={loading}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
