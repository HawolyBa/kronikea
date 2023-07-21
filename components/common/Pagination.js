import React from "react";
import { Pagination as Paginate, Badge } from "antd";
import { useTranslation } from 'next-i18next'
import { IoIosLock } from "react-icons/io";

import { colors } from '../../utils/constants'

import StoryCard from "./StoryCard";
import CharacterCard from "./CharacterCard";
import LocationCard from "./LocationCard";
import StoryMiniCard from "./StoryMiniCard";
import StoryCardMini from "./StoryCardMini";
import UserCard from "./UserCard";
import UserComment from "./UserComment";

// TODO - USE DATAPERPAGE

const Pagination = ({
  data,
  type,
  dataPerPage,
  auth,
  authorId,
  authorName,
  routeId,
  show,
  commentType,
  showModal,
  setAnsweredTo
}) => {
  const [width, setWidth] = React.useState(0)
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    datasPerPage: type === 'characters-archives' ? 24 : type === 'stories' ? 4 : 6
  });
  const { t } = useTranslation();
  const { currentPage, datasPerPage } = pagination;
  const indexOfLastData = currentPage * datasPerPage;
  const indexOfFirstData = indexOfLastData - datasPerPage;

  const currentDatas = data?.slice(indexOfFirstData, indexOfLastData);

  const handleClick = (e) => {
    document.getElementById(`${type}-pagination`).scrollTo(0, 0)
    setPagination({ ...pagination, currentPage: Number(e) });
  };

  let pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data?.length / datasPerPage); i++) {
    pageNumbers.push(i);
  }
  const updateDimensions = () => {
    setWidth(window.innerWidth)
  }

  React.useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // const renderDatas =
  React.useEffect(() => {
    const changePagination = () => {
      setPagination({
        ...pagination,
        datasPerPage: type === 'comments' ? 15 : type === 'profile' ? 6 : type === 'stories-archives' ? 20 : type === 'users-archives' ? 20 : type === 'characters-archives' ? 24 : type === 'archives' ? 10 : type === 'stories' ? 4 : (type === 'characters' || type === 'locations') && (width > 600 && width < 1200) ? 4 : 6
      })
    }
    changePagination()
  }, [width])

  return (
    <div id={`${type}-pagination`}>
      {type === 'stories' || type === 'archives' ? <div className="story__grid">
        {currentDatas.map(data => (
          <StoryCard
            key={data?.id}
            type={type}
            story={data}
          />
        ))}
      </div> : type === 'comments' ?
        data.map((comment) => (
          <UserComment setAnsweredTo={setAnsweredTo} showModal={showModal} auth={auth} comment={comment} key={comment.id} authorId={authorId} authorName={authorName} routeId={routeId} type={commentType} />
        )) : type === 'profile' || type === 'archives' || type === 'fav-profile' ? <div className="sm:grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 place-content-center place-items-center mb-6">
          {currentDatas.map(data => (
            <StoryCardMini
              type={type === 'profile' ? '' : 'other'}
              width={52} height={72}
              key={data?.id}
              data={data}
            />
          ))}
        </div> : type === 'characters-archives' ? <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
          {currentDatas.map(data => (
            <CharacterCard
              key={data?.id}
              type={type}
              data={data}
            />
          ))}
        </div> : type === "characters" ? <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
          {currentDatas.map(data =>
            data.public ?
              <CharacterCard
                key={data?.id}
                type={type}
                data={data}
              />
              : <div className="w-full"><Badge.Ribbon size="small" text={<span className="flex items-center"><IoIosLock style={{ fontSize: "1.1rem" }} /></span>} color={colors.secondary}>
                <CharacterCard type={type} key={data.id} data={data} />
              </Badge.Ribbon></div>
          )}
        </div> : type === "locations" ? <div className="grid lg:grid-cols-6 md:grid-cols-4 place-content-center sm:grid-cols-3 grid-cols-2 place-items-center gap-6">
          {currentDatas.map(data => (
            <LocationCard
              key={data?.id}
              type={type}
              data={data}
            />
          ))} </div> : type === "profile-locations" ? <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-3 grid-cols-2 place-items-center place-content-center gap-6 mb-8">
            {currentDatas.map(data => (
              <LocationCard
                key={data?.id}
                type={type}
                data={data}
              />
            ))} </div> : type === 'users' ? <div className="grid md:grid-cols-2 grid-cols-1 gap-4 my-5">
              {currentDatas.map(data => (
                <UserCard
                  show={show && show}
                  key={data?.id}
                  data={data}
                />
              ))}
            </div> : type === 'users-archives' ? <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 grid-cols-1">
              {currentDatas.map(data => (
                <UserCard
                  key={data?.id}
                  data={data}
                />
              ))}
            </div> :
          type === 'stories-archives' ? <div className="grid gap-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 place-content-center place-items-center">
            {currentDatas.map(data => (
              <StoryMiniCard
                width={52} height={72}
                key={data?.id}
                data={data}
              />
            ))}
          </div> :
            null}
      <div className="mt-5 flex justify-center">
        <Paginate
          size="small"
          showQuickJumper
          hideOnSinglePage
          onChange={handleClick}
          total={data?.length}
          pageSize={datasPerPage}
          showTotal={(total) => `Total ${total} ${t('common:items')}`}
        />
      </div>
    </div>
  );
};

export default Pagination;
