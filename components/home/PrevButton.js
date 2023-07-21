import { useSwiper } from "swiper/react";
import { LeftCircleFilled } from '@ant-design/icons';

const NextButton = () => {
  const swiper = useSwiper();
  return (
    <button onClick={() => swiper.slidePrev()} className="absolute z-50 left-btn text-slate-50">
      <LeftCircleFilled style={{ fontSize: "30px" }} />
    </button>
  )
}

export default NextButton