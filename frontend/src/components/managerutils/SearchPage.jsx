import { useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'

export default function SearchByImagePage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target?.result)
      reader.readAsDataURL(file)

      setIsLoading(true)
      setErrorMessage(null) // Clear any previous error message

      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append('image', file)

      try {
        // Send the image to Flask backend
        const response = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        console.log("Response from server:", data)

        // Check the response structure
        if (data.error) {
          // If there is an error field, show it
          setSearchResults(null)
          setErrorMessage(data.error)
        } else if (data.status === 'success' && data.message === 'No offender recognized') {
          // No offender found
          setSearchResults(null)
          setErrorMessage('The person is not a known shop offender.')
        } else if (data.name && data.date && data.images) {
          // Map the images object into an array
          const imagePaths = [
            data.images.left,
            data.images.right,
            data.images.frontal,
          ].filter(Boolean) // Filter out any null or undefined image paths

          setSearchResults({
            name: data.name,
            date: data.date,
            images: imagePaths,
          })
        } else {
          // Handle unexpected data structure
          setSearchResults(null)
          setErrorMessage(data.message || 'Received unexpected data from the server.')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        setSearchResults(null)
        setErrorMessage('An error occurred while uploading the image. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[white] text-white pt-2 px-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-black">SEARCH BY IMAGE</h1>

      <div className="bg-[#9f24c2] p-6 rounded-lg mb-8">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-white border-dashed rounded-lg cursor-pointer hover:bg-[#7f35b6]"
        >
          <Upload className="w-8 h-8 mb-2" />
          <span>Upload an image to search</span>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#9f24c2] p-8 rounded-lg flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p>Loading results...</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-[#9f24c2] p-6 rounded-lg text-center text-white">
          <p>{errorMessage}</p>
        </div>
      )}

      {searchResults && (
        <div className="bg-[#9f24c2] p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <p className="mb-2">Name: {searchResults.name}</p>
          <p className="mb-4">Date: {searchResults.date}</p>
          {searchResults.images.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {searchResults.images.map((imagePath, index) => (
                console.log("Image path:", imagePath),
                <div key={index} className="relative aspect-square">
                  <img
                    src={imagePath}
                    alt={`Result image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No images available.</p>
          )}
        </div>
      )}
    </div>
  )
}
