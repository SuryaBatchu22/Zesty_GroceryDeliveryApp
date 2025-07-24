import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputSpace = ({ type, placeholder, name, handleChange, address }) => (

  <input className='w-full px-2 py-2.5 border border-gray-600 rounded outline-none
    text-gray-800 focus:border-primary transition'
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required />
);

const AddAddress = () => {

  const { axios, user, navigate } = useAppContext();
  const [oldAddresses, setOldAddresses] = useState([])
  //const [addressId, setAddressId] = useState("")

  const [address, setAddresses] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setAddresses((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }))
  }

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setOldAddresses(data.addresses);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteAddress = async ({addressId}) => {
    try {
      const { data } = await axios.post('/api/address/delete',{addressId});
      if (data.success) {
        toast.success(data.message);
        getUserAddress()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getUserAddress();
    if (!user) {
      navigate('/cart')
    }
  }, []);

  return (
    <div className='mt-16 pb-16'>

      <div className='flex flex-col md:flex-row justify-between mt-10 gap-10'>
        <div className='flex-1 w-auto'>
          <p className='text-2xl md:text-3xl text-gray-500'>Add &nbsp;
            <span className='font-semibold text-primary'>Shipping Address</span>
          </p>
          <form onSubmit={onSubmitHandler}
            className='relative space-y-3 mt-6 text-sm text-bold '>
            <div className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-10" style={{ backgroundImage: `url(${assets.add_address_iamge})` }}/>
            <div className='relative space-y-3 z-10'>
              <div className='grid grid-cols-2 gap-4'>
                <InputSpace handleChange={handleChange} address={address} name='firstName' type='text' placeholder="First Name" />
                <InputSpace handleChange={handleChange} address={address} name='lastName' type='text' placeholder="Last Name" />
              </div>
              <InputSpace handleChange={handleChange} address={address} name='email' type='email' placeholder="Email Address" />
              <InputSpace handleChange={handleChange} address={address} name='street' type='text' placeholder="Street" />
              <div className='grid grid-cols-2 gap-4'>
                <InputSpace handleChange={handleChange} address={address} name='city' type='text' placeholder="City" />
                <InputSpace handleChange={handleChange} address={address} name='state' type='text' placeholder="State" />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <InputSpace handleChange={handleChange} address={address} name='zipcode' type='text' placeholder="Zipcode" />
                <InputSpace handleChange={handleChange} address={address} name='country' type='text' placeholder="Country" />
              </div>
              <InputSpace handleChange={handleChange} address={address} name='phone' type='text' placeholder="Phone Number" />
              <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
                Save Address
              </button>
            </div>
          </form>
        </div>
        <div className='flex-1 flex-col w-auto'>
          <p className='text-2xl md:text-3xl text-gray-500 mb-6'>Saved Addresses
          </p>
          {oldAddresses.length> 0 ? 
            (<>
            {oldAddresses.map((address,index)=>(
            <div key={index} className='my-2 border border-gray-400 p-3 flex flex-row items-center text-sm rounded-lg shadow-lg transition-all'>
              <div className='w-full'>
                <span className='font-medium text-base'>Name:</span>&nbsp;{address.firstName}&nbsp;{address.lastName} <br></br>
                <span className='font-medium text-base'>Email:</span>&nbsp;{address.email}<br></br>
                <span className='font-medium text-base'>Phone:</span>&nbsp;{address.phone} <br></br>
                <span className='font-medium text-base'>Address:</span>&nbsp;{address.street}, {address.city} , {address.state} , {address.country},{address.zipcode}
              </div>
              <button onClick={()=>deleteAddress({addressId:address._id})} className='ml-2 w-auto cursor-pointer border border-gray-400 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-primary-dull/10 transition-all'>Delete</button>
            </div>
          ))}</>)
          : (
            <div className='flex justify-center h-[10vh] md:h-[40vh] items-center'>No saved addresses</div>
          )}

        </div>
      </div>
    </div>
  )
}

export default AddAddress