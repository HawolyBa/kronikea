import { useSwiper } from "swiper/react";
import { RightCircleFilled } from '@ant-design/icons';

const NextButton = () => {
  const swiper = useSwiper();
  return (
    <button onClick={() => swiper.slideNext()} className="text-slate-50 absolute z-50 right-btn">
      <RightCircleFilled style={{ fontSize: "30px" }} />
    </button>
  )
}

export default NextButton