import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const friendListItems = [
  {
    title: "Quang Sang",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    title: "Thanh Phong",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    title: "Le Duy",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    title: "Vuong Vo",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
  {
    title: "Xuan Hinh",
    img: "https://lh3.googleusercontent.com/a/ACg8ocLHk9kGwF1qNBU3t3xIMY_BmtjbgTlZNjR4gc26zbP5TP8=s360-c-no",
  },
];

export default function FriendsChat() {
  return (
    <div className="flex flex-col">
      <div className="p-4 border-b font-medium text-lg">Say Hi 👋</div>
      <div className="flex flex-col py-2">
        {friendListItems.map((item, index) => {
          return (
            <div
              className="flex items-center gap-2 px-4 py-3 hover:bg-green-200 cursor-pointer"
              key={index}
            >
              <Avatar>
                <AvatarImage src={item.img} alt="user Avatar" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">@{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
