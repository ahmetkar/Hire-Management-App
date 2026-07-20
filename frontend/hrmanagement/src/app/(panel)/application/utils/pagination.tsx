

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  pname:string | "page";
};

export default function Pagination({pname="page", currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set(pname, String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  const getPages = () => {
    const pages: (number | string)[] = [];

     for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
  };

  return (
        <>
       <nav aria-label="Table Paging" className="mb-0 text-muted">
                                      <ul className="pagination justify-content-center mb-0">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}><button className="page-link" 
                                            disabled={currentPage === 1}
                                            onClick={() => changePage(currentPage - 1)}
                                            >Previous</button></li>
                                            {getPages().map((page, index) => (
                                            <li
                                                key={index}
                                                className={`page-item ${
                                                currentPage === page ? "active" : ""
                                                }`}
                                            >
                                                <button
                                                type="button"
                                                className="page-link"
                                               
                                                onClick={() => typeof page === "number" && changePage(page)}
                                                >
                                                {page}
                                                </button>
                                            </li>
                                            ))}
                                                                        
                                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                            <button className="page-link" 
                                            disabled={currentPage === totalPages}
                                            onClick={() => changePage(currentPage + 1)}
                                            >Next</button></li>
                                      </ul>
                        </nav>

    </>
  );
}