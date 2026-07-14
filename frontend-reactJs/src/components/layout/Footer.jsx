import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer = () => (
  <AntFooter className="text-center py-6 text-slate-400 bg-transparent">
    <div className="flex flex-col md:flex-row justify-between items-center max-w-[1600px] mx-auto text-xs">
      <span>© {new Date().getFullYear()} FINANCEX - ប្រព័ន្ធគ្រប់គ្រងហិរញ្ញវត្ថុអាជីព</span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#v">ជំនួយ</a>
        <a href="#v">ឯកជនភាព</a>
        <a href="#v">ជំនាន់ v2.0.4</a>
      </div>
    </div>
  </AntFooter>
);

export default Footer;
