import React from 'react';
import Header from './header';
import Footer from './footer';

const Layout = (props) => {

    return (
        <>
            <div id="page-container">
                <Header page={props.page} />
                <main className={props.mainClassName}>
                    {props.children}
                </main>

                <Footer/>
            </div>
        </>
    );
};

export default Layout;
