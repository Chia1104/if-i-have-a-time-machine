import { type FC, type ReactNode } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
const PageTransition: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { asPath } = useRouter();
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key={asPath}
      transition={{ duration: 0.3 }}>
      {children}
    </motion.main>
  );
};

export default PageTransition;
