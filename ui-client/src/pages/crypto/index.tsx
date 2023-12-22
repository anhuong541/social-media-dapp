import { coinmarketcap } from "@/lib/network";
import { GetStaticProps } from "next";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import TooltipNumber from "@/components/Tooltip/TooltipNumber";
import Image from "next/image";

export const getListingsLatest = async () => {
  const res = await coinmarketcap.get("/v1/cryptocurrency/listings/latest");
  return res.data;
};

export const getStaticProps: GetStaticProps = async () => {
  const topCrypto = await getListingsLatest();

  return {
    props: {
      topCrypto,
    },
    revalidate: 60 * 5,
  };
};

export default function Crypto({ topCrypto }: { topCrypto: any }) {
  return (
    <div className="flex flex-col gap-4 pt-4 h-[90vh] w-full">
      <h2 className="font-medium text-xl text-black px-4">
        🔥 Top 100 Cryptocurrencies
      </h2>
      <div className="overflow-auto border w-full">
        <Table className="table-auto lg:w-full w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium first_uppercase">
                Name
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                Price
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                1h %
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                24h %
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                7d %
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                Volume 24h
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                MarketCap
              </TableHead>
              <TableHead className="font-medium text-right first_uppercase">
                Circulating Supply
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCrypto?.data?.map((item: any, index: number) => {
              return (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  //   onClick={() => router.push(`/cryptocurrency/${item.slug}`)}
                >
                  <TableCell className="whitespace-nowrap flex items-center gap-4">
                    {/* <Link
                      className="flex items-center gap-4"
                      href={`/cryptocurrency/${item.slug}`}
                    > */}
                    <Image
                      src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`}
                      alt="nft"
                      width={30}
                      height={30}
                      className="rounded-xl w-[30px] h-[30px] object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-black font-medium">
                        {item.name}
                      </span>
                      <span className="text-xs">{item.symbol}</span>
                    </div>
                    {/* </Link> */}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    $
                    <TooltipNumber
                      number={item.quote.USD.price}
                      type="balance"
                    />
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-right ${
                        item.quote.USD.percent_change_1h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      <span>
                        <TooltipNumber
                          number={item.quote.USD.percent_change_1h}
                          type="percent"
                        />
                      </span>
                      %
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-right ${
                        item.quote.USD.percent_change_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      <span>
                        <TooltipNumber
                          number={item.quote.USD.percent_change_24h}
                          type="percent"
                        />
                      </span>
                      %
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-right ${
                        item.quote.USD.percent_change_7d >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      <span>
                        <TooltipNumber
                          number={item.quote.USD.percent_change_7d}
                          type="percent"
                        />
                      </span>
                      %
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-right">
                      <span>
                        $
                        <TooltipNumber
                          number={item.quote.USD.volume_24h}
                          type="balance"
                        />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    $
                    <TooltipNumber
                      number={item.quote.USD.market_cap}
                      type="balance"
                    />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <TooltipNumber
                      number={item.circulating_supply}
                      type="balance"
                    />{" "}
                    {item.symbol}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
