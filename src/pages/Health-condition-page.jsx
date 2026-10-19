import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { fetchArticles, slugify } from '../Components/Health library happy flow-Components/healthLibraryApi';

// /health-library/condition/:slug → the matching library article, or a
// library search for the condition when there's no exact match
export default function HealthConditionPage() {
    const { slug } = useParams();
    const [target, setTarget] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const search = `/health-library/browse?q=${encodeURIComponent(slug.replace(/-/g, ' '))}`;
        fetchArticles()
            .then((articles) => {
                const match = articles.find((article) => slugify(article.title || '') === slug);
                return match ? `/health-library/article/${match.bookId}/${match.pageId}` : search;
            })
            .catch(() => search)
            .then((to) => {
                if (!cancelled) setTarget(to);
            });
        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (target) return <Navigate to={target} replace />;
    return <p style={{ padding: '8rem 2rem', textAlign: 'center' }}>Loading…</p>;
}
