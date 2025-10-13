import React from "react";
import { Button } from "./ui/button";

const BecomeAWorker = () => {
  return (
    <footer className="py-20 px-12 text-center bg-[#f4f4f4] dark:bg-[#2a2a2a]/20 border-t ">
      <h2 className="text-3xl mb-4">هل أنت عامل محترف؟</h2>
      <p className="text-[1.1rem] mb-8">
        انضم إلى منصتنا وابدأ في الحصول على المزيد من العملاء
      </p>
      <Button variant={"action"} className="text-xl p-8">
        سجل كعامل الآن
      </Button>
    </footer>
  );
};

export default BecomeAWorker;
