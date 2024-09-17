'use client';

import styles from '@/app/styles/artReddits.module.css'

import { fetchToNavBar } from "@/app/lib/features/artLibrary/fetchData";
import { reddits } from "@/app/lib/features/artLibrary/data";
import { useState, useEffect } from "react";
import { NavDivSkeleton } from "@/app/ui/skeletons";
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Image from "next/image";
import { UserIcon } from '@heroicons/react/24/solid';
import { nFormatter } from "@/app/lib/utils/utils";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { resetGallery, setSelectedSubReddit } from "@/app/lib/features/gallery/gallerySlice";
import { RootState } from '@/app/lib/store';


export default function ArtReddits() {
    const [redditData, setRedditData] = useState<{ [key: string]: any }[]>([]);
    const [loading, setLoading] = useState(true);
    const [areLinksDisabled, setAreLinksDisabled] = useState(false);

    const storeSubReddit = useAppSelector((state: RootState) => state.gallery.selectedSubReddit);



    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const pathSegments = currentPath.split('/');
    const currentSubreddit = pathSegments.length > 2 ? `r/${pathSegments[2]}` : null || "";

    const dispatch = useAppDispatch();

    useEffect(() => {
        const waitForToken = () => {
            return new Promise((resolve) => {
                dispatch(setSelectedSubReddit(currentSubreddit));
                const checkToken = () => {
                    const token = localStorage.getItem('REDDART_ACCESS_TOKEN');
                    if (token) {
                        resolve(token);
                    } else {
                        setTimeout(checkToken, 100);
                    }
                };
                checkToken();
            });
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                await waitForToken();

                const dataPromises = reddits.map((reddit) => fetchToNavBar(reddit.subreddit));
                const results = await Promise.all(dataPromises);
                setRedditData(results.filter(result => result && result.data));

                console.log("Fetched Results:", results);

            } catch (error) {
                console.error("Error fetching Reddit data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLinkClick = (subReddit: string) => {
        if (storeSubReddit === subReddit) {
            return;
        } else if (!areLinksDisabled) {
            setAreLinksDisabled(true);
            dispatch(setSelectedSubReddit(subReddit));

            setTimeout(() => {
                setAreLinksDisabled(false);
            }, 2500); // 3 seconds delay
        }
    };

    return (
        <div>
            {loading ? (
                <NavDivSkeleton redditAmount={reddits.length} />
            ) : (
                redditData.map((redditItem, i) => {
                    const children = redditItem.data || {};
                    const subReddit = children.display_name_prefixed || "No title available";
                    const iconImg = children.icon_img || children.community_icon.replace(/&amp;/g, '&');
                    const subscribers = nFormatter(children.subscribers, 1);

                    return (
                        <div
                            key={subReddit}
                            className={`
                            ${styles.container}
                            ${storeSubReddit === subReddit ? styles.selectedReddit : ""}
                            ${storeSubReddit === subReddit ? "pointer-events-none cursor-pointer" : ""}
                            ${areLinksDisabled && storeSubReddit !== subReddit ? "pointer-events-none transition duration-500 ease-in-out opacity-70" : ""}
                            
                        `}
                        >
                            {/* Blue pseudo-element */}
                            <div className={`
                                absolute top-0 left-0 w-1.5 h-full bg-blue-500 transition-transform ease duration-300 -translate-x-2
                                ${storeSubReddit === subReddit ? "translate-x-0" : ""}
                                `}></div>

                            <Link href={`/${subReddit}`} key={i} onClick={() => handleLinkClick(subReddit)}>
                                <div className='relative flex-column items-center'>
                                    <div className="flex items-center relative">
                                        <Image src={iconImg} alt="Community Icon" width={50} height={50}
                                            className="rounded-full border border-2 border-light-primary"
                                        />
                                        <div className="flex-inline ml-3">
                                            <h4>{subReddit || <Skeleton width={150} />}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex text-light-secondaryText text-xs items-center my-1">
                                            <UserIcon className="size-3" />
                                            <p>{subscribers || <Skeleton width={30} />}</p>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 size-3" />
                                </div>
                            </Link>
                        </div>
                    );
                })
            )}
        </div>
    );
};
