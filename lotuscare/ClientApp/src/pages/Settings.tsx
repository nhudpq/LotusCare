export default function Settings() {
  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Settings</h1>
        <p className='text-gray-600 mt-2'>
          Configure your account and preferences
        </p>
      </div>

      <div className='max-w-2xl'>
        <div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
          <h2 className='text-xl font-bold mb-4'>Account Settings</h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                defaultValue='user@example.com'
                className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Organization Name
              </label>
              <input
                type='text'
                defaultValue='Acme Ince'
                className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Phone
              </label>
              <input
                type='tel'
                placeholder='+1234567890'
                className='mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <button className='mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
