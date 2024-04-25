import Wrapper from '../Components/Wrapper.jsx';
import {useQuery} from '@tanstack/react-query';
import axios from '../lib/axios.js';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Images = () => {
  const fetchImages = async () => {
    const response = await axios.get('/api/images');

    return response.data;
  };

  const {data: images, isPending, error} = useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return toast.error(error.response.data.message);
  }

  return (
      <Wrapper>
        <ToastContainer/>
        <div className="carousel">
          {images.map((image, index) => (
              <div key={index + 1} id={'slide' + (index + 1)} className="carousel-item relative w-full">
                <img src={image.path} alt={`Slide ${index + 1}`} className="w-full object-cover rounded-lg"
                     loading="lazy"/>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a
                      href={'#slide' + (((index - 1 + images.length) % images.length) + 1)}
                      className="btn btn-circle"
                  >
                    ❮
                  </a>
                  <a href={'#slide' + (((index + 1) % images.length) + 1)} className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
          ))}
        </div>
      </Wrapper>
  );
};

export default Images;