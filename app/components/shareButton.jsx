"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "lucide-react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  PinterestShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  ThreadsShareButton,
  ThreadsIcon,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  PinterestIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

const ShareButtons = () => {
  const pathname = usePathname();
  let shareUrl = `http://localhost:3000/${pathname}`;
  shareUrl = shareUrl.replace(/([^:]\/)\/+/g, "$1"); // Fix duplicate slashes

  const [copied, setCopied] = useState(false);
  const [shareCounts, setShareCounts] = useState({
    facebook: 0,
    whatsapp: 0,
    reddit: 0,
    pinterest: 0,
    twitter: 0,
    linkedin: 0,
    threads: 0,
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    setShareCounts((prev) => ({
      ...prev,
      [platform]: prev[platform] + 1,
    }));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap justify-center gap-4">
        <p className="w-full text-center text-ms text-white font-bold font-boldfont-bold">Share on social media</p>

        {/* Facebook */}
        <div className="flex flex-col items-center">
          <FacebookShareButton url={shareUrl} quote={`Check this out: ${shareUrl}`} onClick={() => handleShare("facebook")}>
            <FacebookIcon size={42} className="rounded-3xl" />
          </FacebookShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.facebook} Shares</span>
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col items-center">
          <WhatsappShareButton url={shareUrl} onClick={() => handleShare("whatsapp")}>
            <WhatsappIcon size={42} className="rounded-3xl" />
          </WhatsappShareButton>
          <span className="text-xs text-white font-bold ">{shareCounts.whatsapp} Shares</span>
        </div>

        {/* Reddit */}
        <div className="flex flex-col items-center">
          <RedditShareButton url={shareUrl} onClick={() => handleShare("reddit")}>
            <RedditIcon size={42} className="rounded-3xl" />
          </RedditShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.reddit} Shares</span>
        </div>

        {/* Pinterest */}
        <div className="flex flex-col items-center">
          <PinterestShareButton url={shareUrl} onClick={() => handleShare("pinterest")}>
            <PinterestIcon size={42} className="rounded-3xl" />
          </PinterestShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.pinterest} Shares</span>
        </div>

        {/* Twitter */}
        <div className="flex flex-col items-center">
          <TwitterShareButton url={shareUrl} onClick={() => handleShare("twitter")}>
            <TwitterIcon size={42} className="rounded-3xl" />
          </TwitterShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.twitter} Shares</span>
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col items-center">
          <LinkedinShareButton url={shareUrl} onClick={() => handleShare("linkedin")}>
            <LinkedinIcon size={42} className="rounded-3xl" />
          </LinkedinShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.linkedin} Shares</span>
        </div>

        {/* Threads */}
        <div className="flex flex-col items-center">
          <ThreadsShareButton url={shareUrl} onClick={() => handleShare("threads")}>
            <ThreadsIcon size={42} className="rounded-3xl" />
          </ThreadsShareButton>
          <span className="text-xs text-white font-bold">{shareCounts.threads} Shares</span>
        </div>

        {/* Copy Link Button */}
        <div className="flex flex-col items-center">
          <button onClick={copyToClipboard} className="p-2 bg-gray-600 text-white font-bold">
            <Link />
          </button>
          <span className="text-xs text-white font-bold">Copy Link</span>
        </div>
      </div>

      {copied && (
        <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-800 text-white font-bold font-boldtext-sm px-4 py-2 rounded-lg shadow-md">
          URL copied to clipboard
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
