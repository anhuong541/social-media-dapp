import { coinstats } from "@/lib/network";
import { add3Dots } from "@/lib/utils";
import dayjs from "dayjs";
import { GetStaticProps } from "next";
import defaultImage from "./../../../public/new-default-img.png";

export const getNews = async () => {
  try {
    const res = await coinstats.get(`/news/type/trending?limit=30`);
    return res.data;
  } catch (error) {
    console.log("this is error : ", error);
  }
};

const handleImgError = (e: any) => {
  console.log(e);
  // lỗi detect
  e.target.src = "/new-default-img.png";
  e.onerror = null;
};
// cần xử lý data ở api để khi đổi trang sẽ fetch data trang mới

export const getStaticProps: GetStaticProps = async () => {
  const listNews = await getNews();

  return {
    props: {
      listNews,
    },
    revalidate: 60 * 5,
  };
};

export default function NewsPage({ listNews }: { listNews: any }) {
  return (
    <div className="flex flex-col gap-4 pt-4 h-[90vh] w-full">
      <h2 className="font-medium text-xl text-black px-4">🔥 Trending News</h2>
      <div className="grid grid-cols-3 gap-4 px-4 overflow-y-auto app_scroll_bar">
        {listNews.map((item: any, index: number) => {
          return (
            <div className="flex flex-col gap-6" key={index}>
              <a
                href={item.link}
                target="_blank"
                className="w-full h-[250px] overflow-hidden rounded-[10px]"
              >
                <img
                  className="w-full h-full object-cover"
                  src={item?.imgUrl || "/new-default-img.png"}
                  alt={item?.title || ""}
                  onError={handleImgError}
                />
              </a>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <a
                      href={item?.link || "/"}
                      target="_blank"
                      className="xl:text-xl text-3xl font-medium cursor-pointer"
                    >
                      {item?.title || ""}
                    </a>
                    <div className="flex items-end gap-2">
                      <div className="xl:text-sm text-2xl font-medium">
                        By
                        <span className="font-medium">
                          {item?.source || ""}
                        </span>
                      </div>
                      <div className="xl:text-sm text-2xl text_00000080">
                        {dayjs(item.feedDate).format("MMM DD, YYYY")}
                      </div>
                    </div>
                  </div>
                  <div className="xl:text-sm text-2xl font-normal text_00000099">
                    {add3Dots(item.description || "", 150)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
